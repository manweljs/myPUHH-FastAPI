import React, { useEffect, useState } from "react";
import PageHeader from "../global/PageHeader";
import { CreateLHC, DeleteLHC, GetAllLHC, GetLHC, UpdateLHC } from "./CruisingAPI";
import {
  Button,
  DatePicker,
  Input,
  Popconfirm,
  Radio,
  Select,
  Table,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import FormModal from "../global/FormModal";
import dayjs from "dayjs";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { GetAllRKT } from "../../api/SettingAPI";
import { useUser } from "UserContext";
import { Link } from "react-router-dom";
import style from "./cruising.module.css";
import { LHCType } from "types/Cruising";
import { TahunKegiatanType } from "types";

const dateFormat = "YYYY-MM-DD";
const page = "LHC";
document.title = page;

export default function LHC() {
  const { setPage } = useUser();
  const [objects, setObjects] = useState<LHCType[]>([]);
  const [objectId, setObjectId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [displayForm, setDisplayForm] = useState(false);

  const handleGetAll = async () => {
    const response = await GetAllLHC();
    console.log(response);
    setObjects(response.data);
    setLoading(false);
  };

  useEffect(() => {
    setPage(page);
    handleGetAll();
  }, [setPage]);

  const columns = [
    {
      key: "nomor",
      title: "nomor",
      dataIndex: "nomor",
      render: (nomor: string, record: LHCType) => <Link to={"/lhc/" + record.id}>{nomor}</Link>,
    },
    {
      key: "tanggal",
      title: "tanggal",
      dataIndex: "tanggal",
      render: (tanggal: string) => <span>{dayjs(tanggal).format("DD MMMM YYYY")}</span>,
    },
    {
      key: "tahun",
      title: "Tahun RKT",
      dataIndex: "tahun",
    },
    {
      key: "obyek",
      title: "obyek",
      dataIndex: "obyek",
      render: (obyek: number) => (
        <span>{obyek === 1 ? "Petak / Blok" : "Trase Jalan"}</span>
      ),
    },
    {
      key: "pohon",
      title: "Total Pohon",
      dataIndex: "pohon",
    },
    {
      key: "volume",
      title: "Volume (m3)",
      dataIndex: "volume",
    },
    {
      key: "action",
      title: "",
      render: (record: LHCType) => (
        <div className="action">
          <EditOutlined onClick={() => handleEdit(record.id)} />
          <Popconfirm
            placement="bottomRight"
            title={"Hapus LHC"}
            description={`Apakah anda yakin menghapus LHC ini ?`}
            onConfirm={() => handleDelete(record.id)}
            okText="Hapus"
            cancelText="Batal"
          >
            <DeleteOutlined />
          </Popconfirm>
        </div>
      ),
      width: 80,
    },
  ];

  const handleClose = () => {
    setDisplayForm(false);
    setObjectId(null);
  };

  const handleAdd = () => {
    setDisplayForm(true);
  };

  const handleEdit = (id: string) => {
    if (!id) return;
    setObjectId(id);
    setDisplayForm(true);
  };

  const handleDelete = async (id: string) => {
    const response = await DeleteLHC(id);
    console.log(response);
    response.status && handleGetAll();
  };

  return (
    <div className="lhc">
      <PageHeader page={page} />
      <div className={style.main}>
        <div className={`${style.header} mb-3`}>
          <div className="search">
            <SearchOutlined />
          </div>
          <Button type="primary" onClick={handleAdd}>
            + Add
          </Button>
        </div>

        <Table
          className="table-rkt"
          columns={columns}
          dataSource={objects}
          loading={loading}
        />

        {displayForm && (
          <FormLHC id={objectId} close={handleClose} reload={handleGetAll} />
        )}
      </div>
    </div>
  );
}

const FormLHC = (props: {
  id: string | null;
  close: () => void;
  reload: () => void;

}) => {
  const initial = {
    nama: "",
    obyek: 1,
    rkt: null,
    tanggal: dayjs().format(dateFormat),
  };

  const { id, close, reload } = props;
  const [loading, setLoading] = useState(false);
  const [object, setObject] = useState(initial);

  const handleGet = async () => {
    if (!id) return;
    const response = await GetLHC(id);
    console.log(response);
    response.status && setObject(response.data);
    setLoading(false);
  };

  const handleUpdate = ({ name, value }: any) => {
    console.log(name, value);
    setObject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    const data = JSON.stringify(object);
    const response = id ? await UpdateLHC(data, id) : await CreateLHC(data);
    console.log(response);
    if (response.status) {
      message.success(`${page} Disimpan!`);
      reload();
      close();
    }

    setLoading(false);
  };

  useEffect(() => {
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

  console.log(object);

  return (
    <FormModal width={400} close={handleClose}>
      <FormModal.Header>
        <h3>{page}</h3>
        <div className="delete" onClick={handleClose}></div>
      </FormModal.Header>

      <FormModal.Body>
        <FieldNomor data={object} handleUpdate={handleUpdate} />
        <FieldTahunKegiatan data={object} handleUpdate={handleUpdate} />
        <FieldObyek data={object} handleUpdate={handleUpdate} />
        <FieldTanggal data={object} handleUpdate={handleUpdate} />

        <div className="group mt-5">
          <Button onClick={handleSave} type="primary" loading={loading}>
            Save
          </Button>
          <Button onClick={close} className="ml-2">
            Cancel
          </Button>
        </div>
      </FormModal.Body>
    </FormModal>
  );
};

const FieldNomor = (props: {
  data: any;
  handleUpdate: ({ name, value }: { name: string; value: any }) => void;
}) => {
  const { data, handleUpdate } = props;
  return (
    <div className="field ">
      <div className="label">Nomor {page}</div>
      <Input
        value={data.nomor}
        onChange={(e) => handleUpdate({ name: "nomor", value: e.target.value })}
      />
    </div>
  );
};

const FieldObyek = (props: {
  data: any;
  handleUpdate: ({ name, value }: { name: string; value: any }) => void;
}) => {
  const { data, handleUpdate } = props;
  return (
    <div className="field ">
      <div className="label">Obyek {page}</div>
      <Radio.Group
        value={data.obyek}
        onChange={(e) => handleUpdate({ name: "obyek", value: e.target.value })}
      >
        <Radio.Button value={1}>Petak / Blok</Radio.Button>
        <Radio.Button value={2}>Trase Jalan</Radio.Button>
      </Radio.Group>
    </div>
  );
};

const FieldTanggal = (props: {
  data: any;
  handleUpdate: ({ name, value }: { name: string; value: any }) => void;
}) => {
  const { data, handleUpdate } = props;
  return (
    <div className="field ">
      <div className="label">Tanggal</div>
      <DatePicker
        value={dayjs(data.tanggal)}
        onChange={(e) =>
          handleUpdate({ name: "tanggal", value: dayjs(e).format(dateFormat) })
        }
        format={"DD-MM-YYYY"}
        allowClear={false}
      />
    </div>
  );
};

const FieldTahunKegiatan = (props: {
  data: any;
  handleUpdate: ({ name, value }: { name: string; value: any }) => void;
}) => {
  const { data, handleUpdate } = props;
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleGetAll = async () => {
    const response = await GetAllRKT();
    console.log("response", response);
    setObjects(response.data);
    setLoading(false);
  };

  useEffect(() => {
    handleGetAll();
  }, []);
  return (
    <div className="field ">
      <div className="label">RKT</div>
      <Select
        value={data.rkt}
        onChange={(e) => handleUpdate({ name: "rkt", value: e })}
        loading={loading}
        className="w-100"
      >
        {objects.map((item: TahunKegiatanType, index: number) => (
          <Select.Option value={item.id} key={index}>
            {item.tahun}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};
