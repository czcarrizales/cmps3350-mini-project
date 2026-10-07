
//Brian Armijo

export async function calculate(in_num1: number, in_operator: string, in_num2?: number) {
    const response = await fetch("http://localhost:5000/calculate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            in_num1,
            in_operator,
            in_num2
        })
    })
    return response.json()
}