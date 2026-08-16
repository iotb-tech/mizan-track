"use client";
import { Card } from "@/component";
import { Hero } from "@/component/hero";


export default function HomePage(){
    

    return (
      <>
      <Hero />
        <div className="flex items-center justify-center p-10">
          <div className="grid grid-cols-3 gap-16">
            <Card
              icon="₦"
              title="Know Your Spending"
              content="Record expenses, organise them by category and keep an eye on your budget.

"
            />
            <Card
              icon="₦"
              title="Know Your Spending"
              content="Record expenses, organise them by category and keep an eye on your budget.

"
            />
            <Card
              icon="₦"
              title="Know Your Spending"
              content="Record expenses, organise them by category and keep an eye on your budget.

"
            />

            <select name="name" id="name">
              <option value="gg">ggg</option>
              <option value="ggg">gdgg</option>
              <option value="ghg">ggig</option>
              <option value="ggt">gggk</option>
              <option value="gdg">hggg</option>
              <option value="ggm">gggg</option>
              <option value="ggl">gbbgg</option>
            </select>
          </div>
        </div>
      </>
    );
}