import React, {useEffect} from "react";
import {Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import {formatRoute} from "../../util/router";
import {INDEX} from "../routes";
import {MatomoLink} from "../../matomo"

export default function LegalPage() {
  useEffect(() => {
    document.title = "DS-Ultimate"
  }, [])

  return (
      <Card.Body>
        <h1>Impressum</h1>
        <br />
        Angaben gemäß § 5 TMG<br />
        Sebastian Schurr<br />
        Berliner Platz 1 <br />
        27570 Bremerhaven<br />
        Telefon: Auf Anfrage<br />
        Mail: <a href='mailto:info@mail.schurr-sebastian.de'>info@mail.schurr-sebastian.de</a><br />
        <br />

        <p><h4><strong><u>Haftungsausschluss: </u></strong></h4></p>
        <strong>Haftung für Inhalte</strong><br />
        Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.<br />
        <br /><strong>Haftung für Links</strong><br />
        Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.<br />
        <br /><strong>Urheberrecht</strong><br />
        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.<br />
        <br /><strong>Datenschutz</strong><br />
        Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder eMail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben. <br />
        Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich. <br />
        Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten durch Dritte zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit ausdrücklich widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-Mails, vor.<br />
        <br />
        Impressum vom <MatomoLink as={"a"} params={{href: 'https://www.impressum-generator.de'}} >Impressum Generator</MatomoLink> der <MatomoLink as={"a"} params={{href: "https://www.kanzlei-hasselbach.de/standorte/bonn/"}}>Kanzlei Hasselbach, Bonn</MatomoLink>
        <br />
        <br />
        <h4><u>Datenschutzerklärung Matomo:</u></h4>
        <br />
        <b>Zweck der Datenverarbeitung</b>
        <p>
          Diese Webseite verwendet <MatomoLink as={"a"} params={{href:"https://matomo.org"}}>Matomo</MatomoLink>, eine Open Source, selbstgehostete Software um anonyme Nutzungsdaten für diese Webseite zu sammeln.
          <br />
          Die Daten zum Verhalten der Besucher werden gesammelt um eventuelle Probleme wie nicht gefundene Seiten, Suchmaschinenprobleme oder unbeliebte Seiten herauszufinden. Sobald die Daten (Anzahl der Besucher die Fehlerseiten oder nur eine Seite sehen, usw.) verarbeitet werden, erzeugt Matomo Berichte für die Webseitenbetreiber, damit diese darauf reagieren können. (Layoutveränderungen, neue Inhalte, usw.)
          <br />
          <br />
          Matomo verarbeitet die folgenden Daten:
          <ul>
            <li>Cookies</li>
            <li>Anonymisierte IP-Adressen indem die letzten 2 bytes entfernt werden (also 198.51.0.0 anstatt 198.51.100.54)</li>
            <li>Pseudoanonymisierter Standort (basierend auf der anonymisierten IP-Adresse)</li>
            <li>Datum und Uhrzeit</li>
            <li>Titel der aufgerufenen Seite</li>
            <li>URL der aufgerufenen Seite</li>
            <li>URL der vorhergehenden Seite (sofern diese das erlaubt)</li>
            <li>Bildschirmauflösung</li>
            <li>Lokale Zeit</li>
            <li>Dateien die angeklickt und heruntergeladen wurden</li>
            <li>Externe Links</li>
            <li>Dauer des Seitenaufbaus</li>
            <li>Land, Region, Stadt (mit niedriger Genauigkeit aufgrund von IP-Adresse)</li>
            <li>Hauptsprache des Browsers</li>
            <li>User Agent des Browsers</li>
            <li>Interaktionen mit Formularen (aber nicht deren Inhalt)</li>
          </ul>
        </p>
        <br />
        <b>Basis des Legitimen Interesses</b>
        <p>
          Die Datenverarbeitung basiert auf dem Prinzip des legitimen Interesses.
          <br />
          Verarbeiten der Daten hilft uns herauszufinden, was auf unserer Seite funktioniert und was nicht. Zum Beispiel finden wir damit heraus, ob die Inhalte gut ankommen oder wie wir die Struktur der Webseite verbessern können. Unser Team profitiert davon und kann darauf reagieren. Aufgrund der Datenverarbeitung profitieren Sie somit von einer Webseite, die laufend besser wird.
          <br />
          Ohne den Daten könnten wir den Service nicht bieten. Ihre Daten werden ausschließlich zum Verbessern der Webseitennutzung verwendet.
          <br />
        </p>
        <b>Empfänger der Daten</b>
        <p>
          Die persönlichen Daten werden gesendet an:
          <ul>
            <li>Uns (das Team von <Link to={formatRoute(INDEX)}>DS-Ultimate</Link>)</li>
            <li><MatomoLink as={"a"} params={{href: "https://www.netcup.de/"}}>Netcup</MatomoLink> (Hoster des Servers)</li>
          </ul>
        </p>
        <br />
        <b>Details zum Transfer in Drittstaaten</b>
        <p>
          Die Daten dieser Webseite und Matomo werden in Deutschland gehostet. Die Daten verlassen nie die EU.
        </p>
      </Card.Body>
  )
}
