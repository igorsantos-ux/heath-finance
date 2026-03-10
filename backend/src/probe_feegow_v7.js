const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmZWVnb3ciLCJhdWQiOiJwdWJsaWNhcGkiLCJpYXQiOjE3NzMxNDcwODUsImxpY2Vuc2VJRCI6MzkyOTN9.yWKBGMSkWazwWFn-6KQPJYocsNSqjkE86oMSu6Jtlt8';

const variations = [
    { headers: { 'Authorization': `Bearer ${token}` } },
    { headers: { 'api-key': token } },
    { headers: { 'token': token } },
    { headers: { 'x-access-token': token, 'Accept': '*/*' } }
];

async function probe() {
    const url = 'https://api.feegow.com/v1/api/unidades/listar';
    for (const v of variations) {
        try {
            console.log(`\n🔍 Tentando headers: ${JSON.stringify(Object.keys(v.headers))}`);
            const response = await fetch(url, {
                method: 'GET',
                headers: v.headers
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
