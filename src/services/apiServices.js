const getSuspender = (promise) => {
    let status = 'pending';
    let response;

    const suspender = promise.then(
        (res) => {
            status = 'resolved';
            response = res;
        },
        (err) => {
            status = 'error';
            response = err;
        }
    );

    const read = () => {
        if (status === 'pending') throw suspender;
        if (status === 'error') throw response;
        return response;
    };

    return { read };
};

export function fetchData(url) {
    const promise = fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch((err) => {
            throw new Error(`Error fetching data: ${err.message}`);
        });

    return getSuspender(promise);
}
