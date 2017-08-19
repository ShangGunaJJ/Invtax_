using Ace;
using Ace.Application;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Ace.Application
{
    public class AppServiceFactory : IAppServiceFactory
    {
        List<IAppService> _managedServices = new List<IAppService>();

        static readonly Type[] InjectConstructorParamTypes = new Type[] { typeof(IAppServiceFactoryProvider) };
        static readonly object[] EmptyObjects = new object[0];
        static List<Type> _serviceTypes = new List<Type>();

        public AppServiceFactory()
            : this(null)
        {
        }
        public AppServiceFactory(IAceSession session)
        {
            this.Session = session;
        }

        public IAceSession Session { get; set; }

        public void AttachService(IAppService service)
        {
            this._managedServices.Add(service);
        }
        public void DetachService(IAppService service)
        {
            this._managedServices.Remove(service);
        }

        public virtual T CreateService<T>(bool managed = true) where T : IAppService
        {
            Type t = typeof(T);

            ConstructorInfo c = null;
            bool injectAppServiceFactoryProvider = false;

            /* List 的查找效率和反射创建对象的性能稍微差点，如有必要，需要优化 */
            _serviceTypes.Find(a =>
            {
                if (a.IsAbstract == true)
                    return false;

                if (t.IsAssignableFrom(a) == false)
                    return false;

                c = a.GetConstructor(Type.EmptyTypes);
                injectAppServiceFactoryProvider = false;

                if (c == null)
                {
                    c = a.GetConstructor(InjectConstructorParamTypes);
                    injectAppServiceFactoryProvider = true;
                }

                if (c == null)
                {
                    return false;
                }

                return true;
            });

            if (c == null)
                throw new Exception("Can not find the service implementation.");

            T service = default(T);
            if (injectAppServiceFactoryProvider == false)
            {
                service = (T)c.Invoke(EmptyObjects);
                IAppServiceFactoryProvider factoryProvider = service as IAppServiceFactoryProvider;
                if (factoryProvider != null)
                {
                    factoryProvider.ServiceFactory = this;
                }
            }
            else
            {
                service = (T)c.Invoke(new Object[1] { this });
            }

            IAceSessionAppService sessionService = service as IAceSessionAppService;
            if (sessionService != null)
                sessionService.AceSession = this.Session;

            if (managed == true)
                this.AttachService(service);

            return service;

            throw new NotImplementedException();
        }

        public void Dispose()
        {
            foreach (var service in this._managedServices)
            {
                if (service != null)
                    service.Dispose();
            }
        }

        public static T CreateAppService<T>() where T : IAppService
        {
            using (AppServiceFactory factory = new AppServiceFactory())
            {
                return factory.CreateService<T>();
            }
        }
        public static void Register<T>()
        {
            Register(typeof(T));
        }
        public static void Register(Type t)
        {
            if (t == null || t.IsAbstract || typeof(IAppService).IsAssignableFrom(t) == false)
                throw new ArgumentException();

            lock (_serviceTypes)
            {
                _serviceTypes.Add(t);
            }
        }
        public static void RegisterServices()
        {
            Assembly assembly = Assembly.GetExecutingAssembly();
            RegisterServicesFromAssembly(assembly);
        }
        public static void RegisterServicesFromAssembly(Assembly assembly)
        {
            var typesToRegister = assembly.GetTypes().Where(a =>
            {
                var b = a.IsAbstract == false && a.IsClass && typeof(IAppService).IsAssignableFrom(a) && a.GetConstructor(Type.EmptyTypes) != null;
                return b;
            });

            foreach (var type in typesToRegister)
            {
                Register(type);
            }
        }
    }
}
