using Microsoft.Extensions.DependencyInjection;
using TauriDotNetBridge.Contracts;
using System.Globalization;

namespace App.TauriPlugIn;

public class PlugIn : IPlugIn
{
    static PlugIn()
    {
        // 强制设置为英文，避免资源文件缺失导致的异常
        CultureInfo.DefaultThreadCurrentUICulture = new CultureInfo("en-US");
    }

    public void Initialize(IServiceCollection services)
    {
        services.AddSingleton<HomeController>();
    }
}

public class AppConfig
{
    public string Licence { get; set; } = string.Empty;
    public string BiyinApi { get; set; } = "https://api.biyingapi.com";
}