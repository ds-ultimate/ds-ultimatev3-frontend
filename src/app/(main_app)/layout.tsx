import Navbar from "./navbar";

//TODO: icons with different sizes
//TODO: index.html -> import icons / Initial title / check everything
//TODO: manifest.json -> rewrite this
//TODO: robots.txt copy from current
//TODO: matomo
//TODO: upload web vitals to matomo / own service
//TODO: automatic exception reporting
//TODO: workflow for compile & upload

//https://nextjs.org/docs/advanced-features/i18n-routing
//TODO hreflang
//https://blog.logrocket.com/next-js-13-new-app-directory/ documentation layout
//maybe useSelectedLayoutSegments

/*

Static HTML Export SSG
Are you trying to generate a static HTML export by executing next export and are getting this error?
    Error: i18n support is not compatible with next export. See here for more info on deploying: https://nextjs.org/docs/deployment
But there's a way to work around that with the help of next-language-detector. Check out this blog post and this example project.



  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch(`https://.../posts?locale=${locale}`)
  const posts = await res.json()
 */

export default function MainLayout({
                                     children,
                                   }: {
  children: JSX.Element
}) {
  return (
      <section>
        <Navbar />
        {children}
      </section>
  )
}

