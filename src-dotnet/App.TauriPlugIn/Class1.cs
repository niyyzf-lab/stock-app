using IniParser;
using IniParser.Model;
using System.IO;
using System.Text;

namespace App.TauriPlugIn;




public class LogInInfo
{
    public string? User { get; set; }
    public string? Password { get; set; }
}

public class HomeController(AppConfig config)
{
    public string Login(LogInInfo loginInfo)
    {
        // 控制台打印登录信息
        Console.WriteLine($"尝试登录用户1: {loginInfo.User}");
        // 直接使用注入的 _config
        Console.WriteLine($"[AppConfig] licence={config.Licence}");
        Console.WriteLine($"[AppConfig] biyinapi={config.BiyinApi}");
        return $"User '{loginInfo.User}' logged in successfully";
    }
}