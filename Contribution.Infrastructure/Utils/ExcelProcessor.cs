using Contribution.Core.Interface.Data;
using Contribution.Infrastructure.Utils;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Contribution.Infrastructure.Utils
{
    public class ExcelProcessor : IExcelProcessor
    {
        public Stream Generate<T>(Dictionary<string, IEnumerable<T>> Sheets)
        {
            //Generate Excel Workbook in Memory
            using (var excel = new ExcelPackage())
            {
                foreach (var pair in Sheets)
                {
                    //Return Excel Workbook as a Stream

                    var sheet = AddSheet(excel, pair.Key, pair.Value);
                    sheet.Cells.Style.Font.Size = 11;
                    sheet.Cells.Style.Font.Name = "Calibri";
                }

                var memStream = new MemoryStream();
                excel.SaveAs(memStream);
                memStream.Seek(0, 0);
                return memStream;
            }
        }

        public ExcelWorksheet AddSheet<T>(ExcelPackage excel, string sheetName, IEnumerable<T> data)
        {
            var sheet = excel.Workbook.Worksheets.Add(sheetName);

            //Column Names
            PropertyInfo[] objectProperties = typeof(T).GetProperties();

            //Print Colum Headers
            for (int x = 0; x < objectProperties.Length; x++)
            {
                PropertyInfo pi = objectProperties.ElementAt(x);

                Type colType = pi.PropertyType;

                if ((colType.IsGenericType) && (colType.GetGenericTypeDefinition() == typeof(Nullable<>)))
                {
                    colType = colType.GetGenericArguments()[0];
                }

                sheet.Cells[1, x + 1].Value = pi.Name;
                sheet.Cells[1, x + 1].Style.Font.Bold = true;
            }

            //Print Data
            for (int x = 0; x < data.Count(); x++)
            {
                //Handle Data
                var element = data.ElementAt(x);
                for (int y = 0; y < objectProperties.Length; y++)
                {
                    PropertyInfo pi = objectProperties.ElementAt(y);
                    var value = pi.GetValue(element, null);
                    if (pi.PropertyType.Equals(typeof(DateTime)))
                    {
                        sheet.Cells[x + 2, y + 1].Value = ((DateTime)value).ToString("dd-MMM-yyyy");
                    }
                    else
                    {
                        sheet.Cells[x + 2, y + 1].Value = value;
                    }
                }
            }

            return sheet;
        }

        public IEnumerable<T> Load<T>(Stream uploadStream, string sheetName = null) where T : class, new()
        {
            using (var excel = new ExcelPackage(uploadStream))
            {
                var output = new List<T>();
                var type = typeof(T);
                Dictionary<string, PropertyInfo> properties = new Dictionary<string, PropertyInfo>(StringComparer.OrdinalIgnoreCase);
                foreach (PropertyInfo pinfo in type.GetProperties()) properties[pinfo.Name.ToLower()] = pinfo;

                var headers = new List<String>();

                if (excel.Workbook.Worksheets.Count > 0)
                {
                    ExcelWorksheet currentWorksheet = null;
                    if (string.IsNullOrEmpty(sheetName))
                    {
                        // Get the first worksheet
                        currentWorksheet = excel.Workbook.Worksheets.First();
                    }
                    else
                    {
                        currentWorksheet = excel.Workbook.Worksheets.FirstOrDefault(w => string.Equals(w.Name, sheetName, StringComparison.OrdinalIgnoreCase));
                    }

                    if (currentWorksheet == null) throw new Exception("Sheet not Found");

                    // read header columns
                    int currColumn = 1;
                    string columnName = "";
                    do
                    {
                        columnName = "" + currentWorksheet.Cells[1, currColumn].Value;
                        if (string.IsNullOrWhiteSpace(columnName)) continue;
                        headers.Add(columnName.Replace(" ", string.Empty).ToLower().Trim());
                        currColumn++;
                    }
                    while (!string.IsNullOrWhiteSpace(columnName));

                    //Read Cells in Order
                    T item = null;
                    for (int row = 2; row < currentWorksheet.Cells.End.Row; row++)
                    {
                        //item = type.GetConstructor(Type.EmptyTypes).Invoke(new object[0]) as T;
                        item = new T();
                        bool hasValue = false;

                        for (int hindex = 0; hindex < headers.Count; hindex++)
                        {
                            var header = headers[hindex];
                            if (!properties.ContainsKey(header)) continue;
                            //else
                            PropertyInfo pinfo = properties[header];
                            //value = convertValue(pinfo, currentWorksheet.Cells[row, hindex + 1].Value);
                            if (currentWorksheet.Cells[row, hindex + 1].Value == null) continue;
                            else if (hasValue |= true) pinfo.SetValue(item, convertValue(pinfo, currentWorksheet.Cells[row, hindex + 1].Value)); //killing two statements with one line of code ;)
                        }
                        if (hasValue) output.Add(item);
                        else break; //break to avoid running through the entire rows since we encountered a row with no valid value
                    }
                }
                return output;
            }
        }

        private object convertValue(PropertyInfo pinfo, object value)
        {
            if (pinfo.PropertyType == typeof(DateTime))
            {
                DateTime retDate;
                bool parsed = DateTime.TryParse("" + value, out retDate);
                return retDate;
            }
            else if (pinfo.PropertyType == typeof(int))
            {
                int ret;
                int.TryParse("" + value, out ret);
                return ret;
            }
            else if (pinfo.PropertyType == typeof(double))
            {
                double ret;
                double.TryParse("" + value, out ret);
                return ret;
            }
            else if (pinfo.PropertyType.IsSubclassOf(typeof(Enum)))
            {
                MethodInfo minfo = typeof(Enum).GetMethod("Parse", new[] { typeof(Type), typeof(string), typeof(bool) });
                try
                {
                    return minfo.Invoke(null, new object[] { pinfo.PropertyType, "" + value, true });
                }
                catch (Exception)
                {
                    return null;
                }
            }
            else if (pinfo.PropertyType == typeof(string))
            {
                return value == null ? null : value.ToString().Trim();
            }
            else return null;
        }

        public Stream Generate(IEnumerable<DataTable> Tables)
        {
            var excel = new ExcelPackage();

            foreach (var table in Tables)
            {
                var tableName = string.IsNullOrWhiteSpace(table.TableName) ? "Sheet " + Tables.ToList().IndexOf(table) + 1 : table.TableName;
                var sheet = excel.Workbook.Worksheets.Add(tableName);

                //Write Headers to Sheet
                for (int i = 0; i < table.Columns.Count; i++)
                {
                    var column = table.Columns[i];
                    sheet.Cells[1, i + 1].Value = column.ColumnName;
                }

                //Write Data to Sheet
                for (int j = 0; j < table.Rows.Count; j++)
                {
                    var row = table.Rows[j];
                    for (var k = 0; k < row.ItemArray.Length; k++)
                    {
                        if (table.Columns[k].DataType == typeof(DateTime))
                        {
                            sheet.Cells[j + 2, k + 1].Value = ((DateTime)row[k]).ToString("dd-MMM-yyyy");
                        }
                        else
                        {
                            sheet.Cells[j + 2, k + 1].Value = row[k] == null ? null : row[k].ToString().ToUpper();
                        }
                    }
                }
            }

            var memStream = new MemoryStream();
            excel.SaveAs(memStream);
            memStream.Seek(0, 0);
            return memStream;
        }

        public IEnumerable<DataTable> Load(Stream excelStream)
        {
            using (var excel = new ExcelPackage(excelStream))
            {
                foreach (var ws in excel.Workbook.Worksheets)
                {
                    DataTable tbl = new DataTable()
                    {
                        TableName = ws.Name
                    };
                    foreach (var firstRowCell in ws.Cells[1, 1, 1, ws.Dimension.End.Column])
                    {
                        tbl.Columns.Add(firstRowCell.Text);
                    }
                    var startRow = 2;
                    for (var rowNum = startRow; rowNum <= ws.Dimension.End.Row; rowNum++)
                    {
                        var wsRow = ws.Cells[rowNum, 1, rowNum, ws.Dimension.End.Column];

                        if (wsRow.ToArray().All(r => r.Text == null)) continue;

                        var row = tbl.NewRow();
                        foreach (var cell in wsRow)
                        {
                            row[cell.Start.Column - 1] = (cell.Text == null ? null : cell.Text.Trim());
                        }
                        tbl.Rows.Add(row);
                    }
                    yield return tbl;
                }
            }
        }

        public Task<IEnumerable<DataTable>> LoadAsync(Stream excelStream)
        {
            //Offload Work to another Thread
            return Task.Run(() =>
            {
                //Call ToList to Perform Sheet Loading
                return Load(excelStream).ToList().AsEnumerable();
            });
        }

        public MemoryStream Generate<T>(IEnumerable<T> varlist, string sheetName)
        {
            throw new NotImplementedException();
        }

        //public void ExportDataTableToWorkbook(DataTable exportData, string sheetName)
        //{
        //    // Create the header row cell style
        //    var headerLabelCellStyle = this.Workbook.CreateCellStyle();
        //    headerLabelCellStyle.BorderBottom = CellBorderType.THIN;
        //    var headerLabelFont = this.Workbook.CreateFont();
        //    headerLabelFont.Boldweight = (short)FontBoldWeight.Bold;
        //    headerLabelCellStyle.SetFont(headerLabelFont);

        //    var sheet = CreateExportDataTableSheetAndHeaderRow(exportData, sheetName, headerLabelCellStyle);
        //    var currentNPOIRowIndex = 1;
        //    var sheetCount = 1;

        //    for (var rowIndex = 0; rowIndex < exportData.Rows.Count; rowIndex++)
        //    {
        //        if (currentNPOIRowIndex >= MaximumNumberOfRowsPerSheet)
        //        {
        //            sheetCount++;
        //            currentNPOIRowIndex = 1;

        //            sheet = CreateExportDataTableSheetAndHeaderRow(exportData,
        //                                                            sheetName + " - " + sheetCount,
        //                                                            headerLabelCellStyle);
        //        }

        //        var row = sheet.CreateRow(currentNPOIRowIndex++);

        //        for (var colIndex = 0; colIndex < exportData.Columns.Count; colIndex++)
        //        {
        //            var cell = row.CreateCell(colIndex);
        //            cell.SetCellValue(exportData.Rows[rowIndex][colIndex].ToString());
        //        }
        //    }
        //}


    }
}
