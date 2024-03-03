import moment from "moment/moment";
import "moment/locale/vi";

export const formatDateTimeUnit = (dateTime) => {
    return moment(dateTime).format("L LTS");
};

export const formatMoneyUnit = (price) => {
    return price.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });
};
