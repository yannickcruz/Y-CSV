import { useEffect, useState } from 'react';

const usePingServer = (csvAPI) => {
    const [status, setStatus] = useState("loading");
    let [attempts, setAttempts] = useState(0);

    useEffect(() => {
        let timeoutId;

        const ping = async () => {
            try {

                const response = await csvAPI.pingAPI();

                if (response) {
                    setStatus("ready");
                    return;
                }

                throw new Error();
            } catch(error) {
                setAttempts(++attempts);

                if (attempts >= 30) {
                    setStatus("error");
                    return;
                }

                timeoutId = setTimeout(ping, 2000);
            }
        };

        ping();

        return () => clearTimeout(timeoutId);
    }, []);

    const payload = {
        status: status,
        attempts: attempts
    };

    return payload;
}

export default usePingServer;