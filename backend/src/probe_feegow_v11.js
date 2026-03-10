const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmZWVnb3ciLCJhdWQiOiJwdWJsaWNhcGkiLCJpYXQiOjE3NzMxNDcwODUsImxpY2Vuc2VJRCI6MzkyOTN9.yWKBGMSkWazwWFn-6KQPJYocsNSqjkE86oMSu6Jtlt8';
const licenseID = 39293;

async function probe() {
    const variations = [
        `https://api.feegow.com/v1/api/search/license/${licenseID}`,
        `http://api.feegow.com/v1/api/search/license/${licenseID}`,
        'https://api.feegow.com/v1/api/unidades/listar'
    ];

    for (const url of variations) {
        try {
            console.log(`\n🔍 Tentando: ${url}`);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-access-token': token
                }
            });

            const status = response.status;
            let text = await response.text();

            console.log(`📡 Status: ${status}`);
            console.log(`📦 Resposta: ${text.substring(0, 100)}`);
        } catch (error) {
            console.log(`❌ Erro: ${error.message}`);
        }
    }
}

probe();
