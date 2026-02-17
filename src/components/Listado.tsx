export default function Component() {
  const blocks = [
    { date: "28/7/2024", name: "Julio Valerio García", age: 40 },
    { date: "29/7/2024", name: "Jesús Tovar", age: 21 },
    { date: "29/7/2024", name: "Jhon A. Graterol M.", age: 19 },
    { date: "29/7/2024", name: "Isaías Fuenmayor", age: 15 },
    { date: "29/7/2024", name: "Olinger Montaño", age: 23 },
    { date: "29/7/2024", name: "Antoni Cañizález", age: 19 },
    { date: "29/7/2024", name: "Jeison J. Bracho M.", age: 22 },
    { date: "29/7/2024", name: "Rances Izarra", age: 30 },
    { date: "29/7/2024", name: "Carlos Porras", age: 26 },
    { date: "29/7/2024", name: "Jesús R. Medina P.", age: 56 },
    { date: "29/7/2024", name: "Gustavo Rojas", age: 29 },
    { date: "29/7/2024", name: "José A. Torres", age: "ND" },
    { date: "29/7/2024", name: "Antonhy D. Moya M.", age: 24 },
    { date: "29/7/2024", name: "Jeison G. España G.", age: 18 },
    { date: "29/7/2024", name: "Eurisjunior Mendoza", age: 24 },
    { date: "29/7/2024", name: "Edgar A. Aristeguieta", age: 42 },
    { date: "29/7/2024", name: "Anibal J. Romero S.", age: 26 },
    { date: "29/7/2024", name: "Dorian Rondón", age: 22 },
    { date: "30/7/2024", name: "Victor Bustos", age: 34 },
    { date: "30/7/2024", name: "Yorgenis E. Leyva M.", age: 35 },
    { date: "31/7/2024", name: "Luis E. Roberto H.", age: 19 },
    { date: "02/8/2024", name: "Gabriel Ramos", age: 33 },
    { date: "04/8/2024", name: "Walter Páez Lucena", age: 29 },
    { date: "21/8/2024", name: "Andrés Ramírez", age: 36 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blocks.map((block, index) => (
          <div
            key={index}
            className="bg-slate-100 dark:bg-gray-800 shadow-lg rounded-2xl border border-transparent hover:border-gray-300/50 transition-all duration-300 ease-in-out hover:scale-105 p-6"
          >
            <p className="text-base font-semibold lg:text-lg text-gray-800 dark:text-gray-200 text-center">
              {block.date} {block.name} ({block.age})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}