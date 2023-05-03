import NavbarTop from "./navbar-top"

export default function Layout({ children }: {children: React.ReactNode}) {
  return (
    <>
        <NavbarTop/>
      <main>{children}</main>
    </>
  )
}
