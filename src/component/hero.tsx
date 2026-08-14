import Link from "next/link";
import { Button } from ".";

export function Hero(){
    return (
      <div className="hero bg-primary-100">
        <div>
          <span>YOUR DAILY BALANCE, SIMPLIFIED</span>
          <h1>
            Build consistency. <span>Track your money.</span>
          </h1>
          <p>
            Mizan Track brings your habits, expenses and personal progress into
            one simple dashboard—so you can see where your time, energy and
            money are going.
          </p>

          <div className="flex gap-5">
            <Button variant="primary">
                <Link href="/register" >Start tracking</Link>
            </Button>
            <Button variant="muted">Sign in</Button>
          </div>
        </div>
        <div></div>
      </div>
    );
}