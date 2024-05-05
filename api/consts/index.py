from enum import Enum


class ROLE(Enum):
    ADMIN = "admin"
    OPERATOR = "operator"
    MANAGER = "manager"

    def __str__(self):
        return self.value


class KATEGORI_TPK(Enum):
    TPK_HUTAN = 0
    TPK_ANTARA = 1


class TARIF_TYPE(Enum):
    PSDH = 0
    DR = 1

    def __str__(self):
        return self.value


class OBYEK(Enum):
    BLOK_PETAK = 0
    TRASE_JALAN = 1

    def __str__(self):
        return self.value


class SORTIMEN(Enum):
    KB = 0
    KBS = 1
    KBK = 2

    def __str__(self):
        return self.value


class KELOMPOK_JENIS(Enum):
    KELOMPOK_MERANTI = 0
    RIMBA_CAMPURAN = 1
    KAYU_INDAH = 2

    def __str__(self):
        return self.value


class ALAT_ANGKUT(Enum):
    LOGGING_TRUCK = 0
    TONGKANG = 1
    RAKIT = 2

    def __str__(self):
        return self.value


class CACAT(Enum):
    GEROWONG = 0
    GUBAL_BUSUK = 1

    def __str__(self):
        return self.value
