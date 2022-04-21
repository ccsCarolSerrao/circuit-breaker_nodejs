import { Request, Response } from 'express';

const healthController = (_: Request, res: Response) => {
    res.json({
        ok: true,
    });
};

export default healthController;
