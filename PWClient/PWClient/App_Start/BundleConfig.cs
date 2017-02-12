using System.Web;
using System.Web.Optimization;

namespace PWClient
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/js/jquery").Include(
                        "~/Client/js/jquery-{version}.js"));
            bundles.Add(new ScriptBundle("~/js/lib").Include(
                        "~/Client/js/respond.js",
                        "~/Client/ts/app.js",
                        "~/Client/materialize/js/materialize.js"));


            bundles.Add(new StyleBundle("~/css/materialize").Include(
                      "~/Client/materialize/css/materialize.css",
                      "~/Client/materialize/css/main.css"));
        }
    }
}