namespace Contribution.Web.Infastructure.Utils
{
    public static class Extensions
    {
        public static string Trim(this string @string, string trimString)
        {
            return @string.TrimStart(trimString).TrimEnd(trimString);
        }
        public static string TrimEnd(this string original, string searchString)
        {
            return original.EndsWith(searchString) ?
               original.Substring(0, original.Length - searchString.Length) :
               original;
        }

        public static string TrimStart(this string original, string searchString)
        {
            return original.StartsWith(searchString) ?
               original.Substring(searchString.Length) :
               original;
        }

    }
}