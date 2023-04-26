using TassskAPI.Services;
using ToDoAPI.Interfaces;
using ToDoAPI.Services;

namespace ToDoAPI.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<UserService>();
            services.AddScoped<BaseService>();
            services.AddScoped<ListService>();
            services.AddScoped<ItemService>();
            services.AddScoped<EventService>();
            services.AddScoped<FileService>();
            services.AddScoped<NotificationService>();
            return services;
        }
    }
}
