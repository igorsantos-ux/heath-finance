const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmZWVnb3ciLCJhdWQiOiJwdWJsaWNhcGkiLCJpYXQiOjE3NzMxNDcwODUsImxpY2Vuc2VJRCI6MzkyOTN9.yWKBGMSkWazwWFn-6KQPJYocsNSqjkE86oMSu6Jtlt8';
const licenseID = 39293;

const variations = [
    { url: 'https://api.feegow.com/v1/api/unidades/listar', params: { licenca_id: licenseID } },
    { url: 'https://api.feegow.com/v1/api/unidades/listar', params: { license_id: licenseID } },
    { url: 'https://api.feegow.com/v1/api/unidades/listar', params: { licenseID: licenseID } },
    { url: 'https://api.feegow.com/v1/api/pacientes/listar', params: { licenca_id: licenseID } }
];

async function probe() {
    for (const v of variations) {
        try {
            console.log(`\n🔍 Tentando: ${v.url}`);
            const q = new URLSearchParams(v.params).toString();
            const finalUrl = `${v.url}?${q}`;

            const response = await fetch(finalUrl, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'User-Agent': 'Mozilla/5.0'
                }
            });

            const status = response.status;
            let text = await response.text();

            console.log(`📡 Status: ${status}`);
            try {
                const json = JSON.parse(text);
                console.log(`📦 JSON:`, JSON.stringify(json, null, 2).substring(0, 500));
            } catch (e) {
                console.log(`📄 Resposta não é JSON.`);
            }
        } catch (error) {
            console.log(`❌ Erro: ${error.message}`);
        }
    }
}

probe();
