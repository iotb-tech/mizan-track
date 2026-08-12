



export default function LayOut({ children }:{ children: React.ReactNode }){
    return (
      <div className="min-h-screen flex flex-col justify-center items-center ">
        <div className="bg-neutral-200 shadow-2xl px-2 py-1 rounded-2xl">
          {children}
        </div>
      </div>
    );
}