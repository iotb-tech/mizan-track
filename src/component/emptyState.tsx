export function EmptyState({title, message}: {title:string; message: string}){
    return(
        <div className="w-full h-auto flex  flex-col  items-center justify-center">
            <h3 className="text-3xl">
                {title}
            </h3>
            <p className="text-xl">{message}</p>
        </div>
    )
}