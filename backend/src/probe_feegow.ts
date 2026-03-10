import axios from 'axios';

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmZWVnb3ciLCJhdWQiOiJwdWJsaWNhcGkiLCJpYXQiOjE3NzMxNDcwODUsImxpY2Vuc2VJRCI6MzkyOTN9.yWKBGMSkWazwWFn-6KQPJYocsNSqjkE86oMSu6Jtlt8';

const variations = [
    'https://api.feegow.com/v1/api/company/list-unity',
    'https://api.feegow.com/v1/api/unidades/listar',
    'http://api.feegow.com/v1/api/company/list-unity',
    'https://api.feegow.com.br/v1/api/company/list-unity',
    'https://api.feegow.com.br/v1/api/unidades/listar',
    'https://api.feegow.com/v1/api/lock/list' // Mencionando no snippet de busca
];

async function probe() {
    for (const url of variations) {
        try {
            console.log(`🔍 Tentando: ${url}`);
            const response = await axios.get(url, {
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            });
            console.log(`✅ SUCESSO! Status: ${response.status}`);
            console.log(`📦 Dados:`, JSON.stringify(response.data).substring(0, 100));
            return;
        } catch (error: any) {
            if (error.response) {
                console.log(`❌ Falha: ${error.response.status} - ${typeof error.response.data === 'string' ? 'HTML Error' : JSON.stringify(error.response.data)}`);
            } else {
                console.log(`❌ Erro: ${error.message}`);
            }
        }
    }
}

probe();
