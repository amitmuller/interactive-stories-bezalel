import { SETTINGS } from '../settings';
import { responseSchema } from './response-schema';

type Message = {
    role: 'system' | 'assistant' | 'user';
    content: string;
};

type ResultObject = {
    response?: object;
    error?: string;
};

export function postMessages(
    messages: Message[],
    onResponse: (result: ResultObject) => void
) {
    fetch(`${SETTINGS.SERVER_URL}/story-completions`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            responseSchema: responseSchema,
            messages,
        }),
    })
        .then((res) => {
            if (!res.ok) {
                throw res.statusText;
            }
            return res.json();
        })
        .then((data) => {
            try {
                const responseStr = data.choices[0].message.content;
                const response = JSON.parse(responseStr);
                onResponse({ response });
            } catch (err) {
                console.error('Parsing error: ', err);
                onResponse({ error: err as string });
            }
        })
        .catch((err) => {
            console.error('Api error. Details: ', err);
            onResponse({ error: err });
        });
}
