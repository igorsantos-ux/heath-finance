const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmZWVnb3ciLCJhdWQiOiJwdWJsaWNhcGkiLCJpYXQiOjE3NzMxNDcwODUsImxpY2Vuc2VJRCI6MzkyOTN9.yWKBGMSkWazwWFn-6KQPJYocsNSqjkE86oMSu6Jtlt8';

async function probe() {
    const url = 'https://api.feegow.com/v1/api/unidades/listar';
    try {
        console.log(`🔍 Tentando com Accept-Language: pt-br`);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-access-token': token,
                'Accept': 'application/json',
                'Accept-Language': 'pt-br'
            }
        });

        const status = response.status;
        let text = await response.text();

        console.log(`📡 Status: ${status}`);
        console.log(`📦 Resposta: ${text.substring(0, 500)}`);

        if (status === 200) {
            console.log('✅ SUCESSO!');
        }
    } catch (error) {
        console.log(`❌ Erro: ${error.message}`);
    }
}

probe();
