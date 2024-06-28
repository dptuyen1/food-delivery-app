import json
import urllib.request
import urllib
import uuid
import requests
import hmac
import hashlib
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app import constants


def momo_payment(amount):
    endpoint = "https://test-payment.momo.vn/v2/gateway/api/create"
    partnerCode = "MOMO"
    accessKey = your-access-key
    secretKey = your-secret-key
    orderInfo = optional
    redirectUrl = optional
    ipnUrl = optional
    amount = str(amount)
    orderId = str(uuid.uuid4())
    requestId = str(uuid.uuid4())
    requestType = "captureWallet"
    extraData = ""

    rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType

    # signature
    h = hmac.new(bytes(secretKey, 'ascii'), bytes(rawSignature, 'ascii'), hashlib.sha256)
    signature = h.hexdigest()

    # json object send to MoMo endpoint

    data = {
        'partnerCode': partnerCode,
        'partnerName': "Test",
        'storeId': "MomoTestStore",
        'requestId': requestId,
        'amount': amount,
        'orderId': orderId,
        'orderInfo': orderInfo,
        'redirectUrl': redirectUrl,
        'ipnUrl': ipnUrl,
        'lang': "vi",
        'extraData': extraData,
        'requestType': requestType,
        'signature': signature
    }
    data = json.dumps(data)

    clen = len(data)
    response = requests.post(endpoint, data=data,
                             headers={'Content-Type': 'application/json', 'Content-Length': str(clen)})

    print(response.json())

    return json.dumps(response.json(), indent=4)


def send_mail(restaurant_name, product_name, receiver_mail):
    sender_email = constants.EMAIL
    sender_password = constants.PASSWORD
    receiver_email = receiver_mail
    subject = 'Thông báo'
    body = f'Cửa hàng {restaurant_name} vừa thêm một món mới {product_name}'

    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = receiver_email
    message['Subject'] = subject

    message.attach(MIMEText(body, 'plain'))

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(sender_email, sender_password)

        server.sendmail(sender_email, receiver_email, message.as_string())

    print('Email sent successfully.')
