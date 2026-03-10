const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmZWVnb3ciLCJhdWQiOiJwdWJsaWNhcGkiLCJpYXQiOjE3NzMxNDcwODUsImxpY2Vuc2VJRCI6MzkyOTN9.yWKBGMSkWazwWFn-6KQPJYocsNSqjkE86oMSu6Jtlt8';

const variations = [
    'https://api.feegow.com/api/v1/unidades/listar',
    'https://api.feegow.com.br/api/v1/unidades/listar',
    'http://api.feegow.com/api/v1/unidades/listar',
    'https://api.feegow.com/v1/api/unidades/listar',
    'https://api.feegow.com.br/v1/api/company/list-unity'
];

async function probe() {
    for (const url of variations) {
        try {
            console.log(`\n🔍 Tentando: ${url}`);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Accept': 'application/json'
                }
            });

            const status = response.status;
            let text = await response.text();

            console.log(`📡 Status: ${status}`);
            if (status === 200 || status === 201) {
                console.log(`✅ SUCESSO!`);
                console.log(`📦 Resposta:`, text.substring(0, 200));
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
