const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmZWVnb3ciLCJhdWQiOiJwdWJsaWNhcGkiLCJpYXQiOjE3NzMxNDcwODUsImxpY2Vuc2VJRCI6MzkyOTN9.yWKBGMSkWazwWFn-6KQPJYocsNSqjkE86oMSu6Jtlt8';
const licenseID = 39293;

const variations = [
    { url: 'https://api.feegow.com/v1/api/unidades/listar', method: 'POST' },
    { url: 'https://api.feegow.com/v1/api/unidades/listar', method: 'GET', params: { licenseID } },
    { url: 'https://api.feegow.com/v1/api/company/list-unity', method: 'GET' },
    { url: 'https://api.feegow.com/v1/api/company/list-unity', method: 'POST' }
];

async function probe() {
    for (const v of variations) {
        try {
            console.log(`\n🔍 Tentando: ${v.method} ${v.url}`);

            let finalUrl = v.url;
            if (v.params) {
                const q = new URLSearchParams(v.params).toString();
                finalUrl += `?${q}`;
            }

            const response = await fetch(finalUrl, {
                method: v.method,
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                },
                body: v.method === 'POST' ? JSON.stringify({ licenseID }) : undefined
            });

            const status = response.status;
            let text = await response.text();

            console.log(`📡 Status: ${status}`);
            try {
                const json = JSON.parse(text);
                console.log(`📦 JSON:`, JSON.stringify(json, null, 2));
            } catch (e) {
                console.log(`📄 Resposta não é JSON.`);
            }
        } catch (error) {
            console.log(`❌ Erro: ${error.message}`);
        }
    }
}

probe();
