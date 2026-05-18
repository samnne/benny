import typing_extensions as typing

class Merchant(typing.TypedDict):
    name:    str
    address: str | None

class Item(typing.TypedDict):
    name:        str
    quantity:    float
    unit_price:  float
    total_price: float

class Receipt(typing.TypedDict):
    merchant:       Merchant
    date:           str | None
    time:           str | None
    currency:       str
    items:          list[Item]
    subtotal:       float | None
    tax:            float | None
    tip:            float | None
    discounts:      float | None
    total:          float
    payment_method: str | None
    category:       str
    confidence:     str
    benny_message:  str