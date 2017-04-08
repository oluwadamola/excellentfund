using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Threading.Tasks;

namespace Contribution.Core.Interface.Data
{
    public interface IExcelProcessor
    {
        Stream Generate<T>(Dictionary<string, IEnumerable<T>> Sheets);
        IEnumerable<T> Load<T>(Stream excelStream, string sheet = null) where T : class, new();
        Stream Generate(IEnumerable<DataTable> Sheets);
        IEnumerable<DataTable> Load(Stream excelStream);
        Task<IEnumerable<DataTable>> LoadAsync(Stream excelStream);
        MemoryStream Generate<T>(IEnumerable<T> varlist, string sheetName);
    }
}
