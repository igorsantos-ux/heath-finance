const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmZWVnb3ciLCJhdWQiOiJwdWJsaWNhcGkiLCJpYXQiOjE3NzMxNDcwODUsImxpY2Vuc2VJRCI6MzkyOTN9.yWKBGMSkWazwWFn-6KQPJYocsNSqjkE86oMSu6Jtlt8';
const licenseID = 39293;

const endpoints = [
    '/unidades/listar',
    '/pacientes/listar',
    '/procedimentos/listar',
    '/profissionais/listar',
    '/agendas/listar',
    '/especialidades/listar'
];

async function probe() {
    for (const ep of endpoints) {
        const url = `https://api.feegow.com/v1/api${ep}`;
        try {
            console.log(`\n🔍 Tentando: ${url}`);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'x-license-id': licenseID.toString(),
                    'Accept': 'application/json'
                }
            });

            const status = response.status;
            let text = await response.text();

            console.log(`📡 Status: ${status}`);
            if (status === 200) {
                console.log(`✅ SUCESSO em ${ep}!`);
                console.log(`📦 JSON:`, text.substring(0, 200));
                return;
            } else {
                console.log(`❌ Falha: ${text.substring(0, 100)}`);
            }
        } catch (error) {
            console.log(`❌ Erro: ${error.message}`);
        }
    }
}

probe();
