const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmZWVnb3ciLCJhdWQiOiJwdWJsaWNhcGkiLCJpYXQiOjE3NzMxNDcwODUsImxpY2Vuc2VJRCI6MzkyOTN9.yWKBGMSkWazwWFn-6KQPJYocsNSqjkE86oMSu6Jtlt8';

const variations = [
    'https://api.feegow.com/v1/api/unidades/listar',
    'https://api.feegow.com/v1/api/company/list-unity',
    'https://api.feegow.com/v1/publicapi/unidades/listar',
    'https://api.feegow.com/v1/publicapi/company/list-unity',
    'http://api.feegow.com/v1/api/unidades/listar',
    'https://api.feegow.com/v1/api/professional/list'
];

async function probe() {
    for (const url of variations) {
        try {
            console.log(`\n🔍 Tentando: ${url}`);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            });
            const status = response.status;
            let text = await response.text();

            console.log(`📡 Status: ${status}`);
            try {
                const json = JSON.parse(text);
                console.log(`📦 JSON:`, JSON.stringify(json, null, 2).substring(0, 500));
                if (status === 200 || (json.success !== undefined)) {
                    console.log('✅ CANDIDATO ENCONTRADO!');
                }
            } catch (e) {
                console.log(`📄 Resposta não é JSON (HTML ou Texto).`);
            }
        } catch (error) {
            console.log(`❌ Erro: ${error.message}`);
        }
    }
}

probe();
