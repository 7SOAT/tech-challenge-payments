Feature: Payment Controller

  Scenario: Confirm Payment Webhook
    Given the webhook is triggered with a "payment" message type
    When I confirm the payment with ID 123
    Then the confirmPayment method should be called with ID 123

  Scenario: Do not call confirmPayment with non-payment message type
    Given the webhook is triggered with a "order" message type
    When I try to confirm payment with ID 123
    Then the confirmPayment method should not be called

  Scenario: Create payment successfully
    Given I am sending a request to create a payment with order ID "orderId"
    When the payment creation is successful
    Then the result should contain a QR code

  Scenario: Create payment fails
    Given I am sending a request to create a payment with order ID "orderId"
    When the payment creation fails
    Then the result should throw an error
