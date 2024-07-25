describe('Reservations', () => {

    let jwt: string;

    beforeAll(async () => {
        const user = { email: '7etienne9@gmail.com', password: 'jdl6_lf68Dk^je' };
        await fetch('http://auth:3001/users', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const response = await fetch('http://auth:3001/auth/login', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        jwt = await response.text();
    })

    test('Create & Get', async () => {
        const createdReservation = await createReservation();
        const responseGet = await fetch(
          `http://reservations:3000/reservations/${createdReservation._id}`,
          {
            headers: {
              Authentication: jwt,
            },
          },
        );
        const reservation = await responseGet.json();
        expect(createdReservation).toEqual(reservation);
    });

    const createReservation = async () => {
        const responseCreate = await fetch('http://reservations:3000/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authentication: jwt
            },
            body: JSON.stringify({
                startDate: '2024-05-18T00:00:00.000Z',
                endDate: '2024-05-19T00:00:00.000Z',
                placeId: '12345',
                invoiceId: '678',
                charge: {
                    amount: 10,
                    card: {
                        cvc: '413',
                        exp_month: 12,
                        exp_year: 2027,
                        number: '4000 0025 0000 0003'
                    }
                }
            })
        });
        expect(responseCreate.ok).toBeTruthy();
        const reservation = await responseCreate.json();
        return reservation;
    };
});
