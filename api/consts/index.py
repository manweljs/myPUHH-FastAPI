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
