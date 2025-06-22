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

public class HomeController
{
    private readonly AppConfig _config;
    public HomeController(AppConfig config)
    {
        _config = config;
    }
    public string Login(LogInInfo loginInfo)
    {
        // 控制台打印登录信息
        Console.WriteLine($"尝试登录用户1: {loginInfo.User}");
        // 推荐用当前目录，或你可以指定绝对路径
        var configPath = Path.Combine(Directory.GetCurrentDirectory(), "config.ini");
        Console.WriteLine(configPath);
        if (File.Exists(configPath))
        {
            var parser = new FileIniDataParser();
            // 显式指定编码，防止中文乱码
            var data = parser.ReadFile(configPath, Encoding.UTF8);
            var section = data["appConfig"];
            if (section != null)
            {
                var licence = section["licence"] ?? "";
                var biyinapi = section["biyinapi"] ?? "";
                Console.WriteLine($"[config.ini] licence={licence}");
                Console.WriteLine($"[config.ini] biyinapi={biyinapi}");
            }
            else
            {
                Console.WriteLine("[config.ini] 未找到 appConfig 段");
            }
        }
        else
        {
            Console.WriteLine("[config.ini] 文件不存在");
        }
        return $"User '{loginInfo.User}' logged in successfully";
    }
}