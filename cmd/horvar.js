export function run(args) {
    const timezones = {
        "tokyo-jp": "Asia/Tokyo",
        "brasil": "America/Sao_Paulo"
    };

    const varName = args[0].replace(/"/g, "");
    const zone = args[2];

    const tz = timezones[zone] || "UTC";

    return `let ${varName} = new Date().toLocaleString("pt-BR",{timeZone:"${tz}"});`;
}
