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


public class LogInInfo
{
    public string? User { get; set; }
    public string? Password { get; set; }
}

public class HomeController
{
    public string Login(LogInInfo loginInfo)
    {
        return $"User '{loginInfo.User}' logged in successfully";
    }
}