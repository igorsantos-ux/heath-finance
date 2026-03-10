const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmZWVnb3ciLCJhdWQiOiJwdWJsaWNhcGkiLCJpYXQiOjE3NzMxNDcwODUsImxpY2Vuc2VJRCI6MzkyOTN9.yWKBGMSkWazwWFn-6KQPJYocsNSqjkE86oMSu6Jtlt8';

const variations = [
    'https://api.feegow.com/v1/api/company/list-unity',
    'https://api.feegow.com/v1/api/unidades/listar',
    'http://api.feegow.com/v1/api/company/list-unity',
    'http://api.feegow.com/v1/api/unidades/listar',
    'https://api.feegow.com.br/v1/api/company/list-unity',
    'https://api.feegow.com.br/v1/api/unidades/listar',
    'https://api.feegow.com/v1/api/lock/list'
];

async function probe() {
    for (const url of variations) {
        try {
            console.log(`🔍 Tentando: ${url}`);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            });
            const status = response.status;
            const text = await response.text();

            if (status === 200) {
                console.log(`✅ SUCESSO! Status: ${status}`);
                console.log(`📦 Dados:`, text.substring(0, 150));
                return;
            } else {
                console.log(`❌ Falha: ${status} - ${text.includes('<!DOCTYPE html>') ? 'HTML Error' : text.substring(0, 100)}`);
            }
        } catch (error) {
            console.log(`❌ Erro: ${error.message}`);
        }
    }
}

probe();
