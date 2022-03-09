import postApi from '../api/postApi';

async function main() {
    const queryParam = {
        _page: 1,
        _limit: 10,
    };
    const response = await postApi.getAll(queryParam);
    console.log(response);
}
main();