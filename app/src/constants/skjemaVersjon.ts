/**
 * Skjemaversjonen denne bundelen er bygget for.
 *
 * Vi kjører én aktiv versjon om gangen, og komponentene her kan bare rendre den ene.
 * Verdien sendes derfor med hver forespørsel mot et redigerbart utkast, slik at backend
 * kan avvise en bundel som ikke matcher aktiv versjon (409 `SKJEMA_DEFINISJON_VERSJON_UTDATERT`).
 *
 * Den skal IKKE hentes fra utkastet: en gammel fane ville da bare speilet tilbake versjonen
 * backend nettopp oppga, og sluppet gjennom sjekken den er ment å feile.
 *
 * Bumpes sammen med `skjemadefinisjon.aktive-versjoner` i melosys-skjema-api.
 */
export const SKJEMA_DEFINISJON_VERSJON = "2";
