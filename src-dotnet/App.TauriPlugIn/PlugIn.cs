using Microsoft.Extensions.DependencyInjection;
using TauriDotNetBridge.Contracts;

namespace App.TauriPlugIn;

public class PlugIn : IPlugIn
{
    public void Initialize(IServiceCollection services)
    {
        services.AddSingleton<HomeController>();
    }
}