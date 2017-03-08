namespace Contribution.Core.Business
{
    public abstract class Model
    {
        public void Assign(object source)
        {
            if (source != null)
            {
                var destProperties = GetType().GetProperties();
                foreach (var sourceProperty in source.GetType().GetProperties())
                {
                    foreach (var desProperty in destProperties)
                    { 
                        if(desProperty.Name == sourceProperty.Name && desProperty.PropertyType.IsAssignableFrom(sourceProperty.PropertyType))
                        {
                            desProperty.SetValue(this, sourceProperty.GetValue(source, new object[] {}), new object[] {});
                            break;
                        }
                    }
                }
            }
        }
    }
}
