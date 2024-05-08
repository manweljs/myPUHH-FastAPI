import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { CreateBukuUkur, GetBukuUkur, UpdateBukuUkur } from "components/buku-ukur/BukuUkurAPI";
import { Button, Modal, message } from "antd";
import { FieldTanggal, dateFormat } from "./fields/FieldTanggal";
import { FieldRKT } from "./fields/FieldRKT";
import { FieldNomor } from "./fields/FieldNomor";
import { FieldObyek } from "./fields/FieldObyek";

interface FormBukuUkurProps {
    id: string | null;
    close: () => void;
    reload: () => void;
    open: boolean;
}

const page = "Buku Ukur"

export const FormBukuUkur: React.FC<FormBukuUkurProps> = (props) => {
    const initial = {
        rkt: null,
        nomor: '',
        tanggal: dayjs().format(dateFormat),
        obyek: 1,
    };

    const { id, close, reload, open } = props;
    const [loading, setLoading] = useState(false);
    const [object, setObject] = useState(initial);

    const handleGet = async () => {
        if (!id) return;
        setLoading(true);
        const response = await GetBukuUkur(id);
        console.log(response);
        response.status && setObject(response.data);
        setLoading(false);
    };

    const handleUpdate = ({ name, value }: { name: string; value: any }) => {
        setObject((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        const data = JSON.stringify(object);
        const response = id ? await UpdateBukuUkur(data, id) : await CreateBukuUkur(data);
        console.log(response);
        if (response.status) {
            message.success(`${page} Disimpan!`); // Assuming page is defined
            reload();
            close();
        }
        setLoading(false);
    };

    useEffect(() => {
        console.log(id);
        if (id) {
            handleGet();
        } else {
            setLoading(false);
        }
    }, [id]);

    const handleClose = () => {
        setObject(initial);
        close();
    };

    return (
        <Modal
            title="Buku Ukur"
            open={open}
            onCancel={handleClose}
            width={400}
            footer={null}
            style={{ top: 30 }}
        // centered
        >
            <FieldRKT data={object} handleUpdate={handleUpdate} />
            <FieldNomor data={object} handleUpdate={handleUpdate} />
            <FieldTanggal data={object} handleUpdate={handleUpdate} />
            <FieldObyek data={object} handleUpdate={handleUpdate} />
            <div className="group mt-5">
                <Button onClick={handleSave} type="primary" loading={loading}>
                    Save
                </Button>
                <Button onClick={handleClose} className="ml-2">
                    Cancel
                </Button>
            </div>
        </Modal>
    );

}
