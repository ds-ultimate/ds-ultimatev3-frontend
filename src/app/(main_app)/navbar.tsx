import NavbarLangSelector from "./navbar.langSelector";
import NavbarClientWrapper from "./navbar.client.wrapper";

export default function Navbar() {
  return (
      <NavbarClientWrapper>
        <NavbarLangSelector languages={["de", "en"]} />
      </NavbarClientWrapper>
  )
}
