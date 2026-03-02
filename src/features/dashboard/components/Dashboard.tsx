import { Card } from '@/components/ui/Card';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { ArrowUpRight, Filter, MoreHorizontal } from 'lucide-react';

const revenueData = [
  { date: 'Apr 7', value: 35000 },
  { date: 'Apr 8', value: 55000 },
  { date: 'Apr 9', value: 40000 },
  { date: 'Apr 10', value: 62800 },
  { date: 'Apr 11', value: 45000 },
  { date: 'Apr 12', value: 20000 },
  { date: 'Apr 13', value: 60000 },
  { date: 'Apr 14', value: 50000 },
];

const trafficData = [
  { age: '45+', female: 20, male: 15 },
  { age: '30+', female: 45, male: 40 },
  { age: '20+', female: 35, male: 30 },
  { age: '15+', female: 25, male: 20 },
  { age: '10+', female: 15, male: 10 },
];

const recentOrders = [
  { id: 1, product: 'Barhat blue', date: 'May 5', status: 'Received', price: '$359.90', customer: 'M-Starlight', image: 'https://picsum.photos/seed/chair1/40/40' },
  { id: 2, product: 'Soft Ginger', date: 'May 4', status: 'Received', price: '$420.78', customer: 'Serene W', image: 'https://picsum.photos/seed/chair2/40/40' },
];

const topProducts = [
  { name: 'Emerald Velvet', sold: 917, price: '$355.90', image: 'https://picsum.photos/seed/chair3/40/40' },
  { name: 'Velvet Coral', sold: 804, price: '$279.00', image: 'https://picsum.photos/seed/chair4/40/40' },
  { name: 'Rotterdam', sold: 738, price: '$329.95', image: 'https://picsum.photos/seed/chair5/40/40' },
  { name: 'Happy Yellow', sold: 684, price: '$315.50', image: 'https://picsum.photos/seed/chair6/40/40' },
];

export function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* Total Revenue */}
          <Card className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-base font-semibold text-text mb-2">Total revenue</h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-text">$17,086.92</span>
                  <span className="flex items-center text-sm font-medium text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    8.34%
                  </span>
                </div>
                <p className="text-sm text-text-muted mt-1">Gained $9,721.54 this month</p>
              </div>
              <select className="bg-surface-hover border-none text-sm font-medium rounded-full px-4 py-2 text-text outline-none cursor-pointer">
                <option>Monthly</option>
                <option>Weekly</option>
              </select>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Middle Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Sold */}
            <Card className="p-6 flex flex-col justify-between">
              <h3 className="text-base font-semibold text-text mb-4">Product sold</h3>
              <div className="flex items-center justify-between">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <span className="text-sm font-medium text-text">Stools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <span className="text-sm font-medium text-text">Sofas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                    <span className="text-sm font-medium text-text">Chairs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-sm font-medium text-text">Tables</span>
                  </div>
                </div>
                <div className="relative w-24 h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Stools', value: 400, color: '#facc15' },
                          { name: 'Sofas', value: 300, color: '#fb923c' },
                          { name: 'Chairs', value: 300, color: '#ec4899' },
                          { name: 'Tables', value: 200, color: '#a855f7' },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {
                          [
                            { name: 'Stools', value: 400, color: '#facc15' },
                            { name: 'Sofas', value: 300, color: '#fb923c' },
                            { name: 'Chairs', value: 300, color: '#ec4899' },
                            { name: 'Tables', value: 200, color: '#a855f7' },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))
                        }
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-text">2 038</span>
                    <span className="text-[10px] text-text-muted">April</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Total Income */}
            <Card className="p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <h3 className="text-base font-semibold text-text">Total income</h3>
                <button className="w-8 h-8 rounded-lg border border-green-200 text-green-500 flex items-center justify-center hover:bg-green-50 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              <div>
                <span className="text-3xl font-bold text-text">$215,835.89</span>
                <p className="text-sm text-text-muted mt-2">24% increase compared to last week</p>
              </div>
            </Card>
          </div>

          {/* Recent Order */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-semibold text-text">Recent order</h3>
              <button className="flex items-center gap-2 bg-surface-hover px-4 py-2 rounded-full text-sm font-medium text-text hover:bg-border transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-muted uppercase bg-transparent border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">#</th>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-surface-hover/50 transition-colors">
                      <td className="px-4 py-4 font-medium text-text">{order.id}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img src={order.image} alt={order.product} className="w-10 h-10 rounded-xl object-cover" referrerPolicy="no-referrer" />
                          <span className="font-semibold text-text">{order.product}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-text-muted">{order.date}</td>
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 rounded-full border border-green-200 text-green-600 text-xs font-medium">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-semibold text-text">{order.price}</td>
                      <td className="px-4 py-4 text-text-muted">{order.customer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          {/* Top Products */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-semibold text-text">Top products</h3>
              <button className="text-text-muted hover:text-text">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {topProducts.map((product, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-hover transition-colors">
                  <div className="flex items-center gap-4">
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-semibold text-text text-sm">{product.name}</h4>
                      <p className="text-xs text-text-muted mt-0.5">{product.sold} sold</p>
                    </div>
                  </div>
                  <span className="font-semibold text-text text-sm">{product.price}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Traffic */}
          <Card className="p-6 flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-semibold text-text">Traffic</h3>
              <select className="bg-surface-hover border-none text-sm font-medium rounded-full px-3 py-1.5 text-text outline-none cursor-pointer">
                <option>All time</option>
                <option>This month</option>
              </select>
            </div>
            <div className="flex justify-between text-sm font-medium mb-4 px-2">
              <span className="text-pink-500">Female</span>
              <span className="text-blue-500">Male</span>
            </div>
            <div className="flex-1 min-h-[200px] w-full relative">
              <div className="absolute inset-0 flex flex-col justify-between">
                {trafficData.map((data, i) => (
                  <div key={i} className="flex items-center w-full gap-2">
                    <span className="text-xs text-text-muted w-8 text-right shrink-0">{data.age}</span>
                    <div className="flex-1 flex items-center justify-center gap-1">
                      <div className="flex-1 flex justify-end">
                        <div 
                          className="h-2 bg-pink-500 rounded-l-full" 
                          style={{ width: `${data.female}%` }}
                        ></div>
                      </div>
                      <div className="flex-1 flex justify-start">
                        <div 
                          className="h-2 bg-blue-500 rounded-r-full" 
                          style={{ width: `${data.male}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
