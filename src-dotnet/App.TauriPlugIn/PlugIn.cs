using Microsoft.Extensions.DependencyInjection;
using TauriDotNetBridge.Contracts;
using System.Globalization;
using System.IO;
using IniParser;
using IniParser.Model;

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
        // 启动时读取 config.ini（使用运行目录）
        var configPath = Path.Combine(AppContext.BaseDirectory, "dotnet", "config.ini");
        var appConfig = new AppConfig();
        if (File.Exists(configPath))
        {
            var parser = new FileIniDataParser();
            IniData data = parser.ReadFile(configPath, System.Text.Encoding.UTF8);
            var section = data["appConfig"];
            if (section != null)
            {
                appConfig.Licence = section["licence"] ?? string.Empty;
                appConfig.BiyinApi = section["biyinapi"] ?? string.Empty;
            }
        }
        services.AddSingleton(appConfig);
        services.AddSingleton<HomeController>();
    }
}

public class AppConfig
{
    public string Licence { get; set; } = string.Empty;
    public string BiyinApi { get; set; } = "https://api.biyingapi.com";
}