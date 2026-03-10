const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmZWVnb3ciLCJhdWQiOiJwdWJsaWNhcGkiLCJpYXQiOjE3NzMxNDcwODUsImxpY2Vuc2VJRCI6MzkyOTN9.yWKBGMSkWazwWFn-6KQPJYocsNSqjkE86oMSu6Jtlt8';

async function probe() {
    const variations = [
        'https://api.feegow.com/v1/api/public/unidades/listar',
        'https://api.feegow.com/v1/api/public/pacientes/listar',
        'https://api.feegow.com/v1/public/api/unidades/listar'
    ];

    for (const url of variations) {
        try {
            console.log(`🔍 Tentando: ${url}`);
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
            console.log(`📦 Resposta: ${text.substring(0, 100)}`);

            if (status === 200) {
                console.log('✅ SUCESSO!');
                return;
            }
        } catch (error) {
            console.log(`❌ Erro: ${error.message}`);
        }
    }
}

probe();
