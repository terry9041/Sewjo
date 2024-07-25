import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';

export const config = {
    api: {
        bodyParser: false,
    },
};

const uploadEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fabric/create`;

const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> =>
    new Promise((resolve, reject) => {
        const form = formidable();
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        try {
            const { fields, files } = await parseForm(req);

            const formData = new FormData();
            for (const key in fields) {
                formData.append(key, fields[key] as string);
            }

            const file = files.image as File;
            const fileStream = fs.createReadStream(file.filepath);
            formData.append('image', fileStream, file.originalFilename);

            const response = await fetch(uploadEndpoint, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const responseData = await response.json();
                res.status(200).json(responseData);
            } else {
                res.status(500).json({ message: 'Failed to upload fabric' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Failed to process form data', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

export default handler;
