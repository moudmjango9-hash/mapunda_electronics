const WA='255693051585';
const SUPABASE_URL='https://bwxwzief ridcfyxjrrcx.supabase.co'.replace(' ','');
const SUPABASE_KEY='sb_publishable_GNlkxyH95h4eqXMRndhnuA_Bc-KRaNN';
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

let products=[
{name:'Smartphone Pro',cat:'Simu',img:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80'},
{name:'Smart TV 55"',cat:'TV',img:'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=700&q=80'},
{name:'Wireless Headphones',cat:'Audio',img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80'},
{name:'Laptop Computer',cat:'Computer',img:'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80'},
{name:'Bluetooth Speaker',cat:'Audio',img:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80'},
{name:'Phone Accessories',cat:'Accessories',img:'https://images.unsplash.com/photo-1609592424251-8f9e1b4d1f5f?auto=format&fit=crop&w=700&q=80'},
{name:'Modern TV',cat:'TV',img:'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=700&q=80'},
{name:'Laptop Pro',cat:'Computer',img:'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=700&q=80'}];
let cart=[];
let allProducts=[...products];

function renderProducts(list=allProducts){
 document.getElementById('productsGrid').innerHTML=list.map((p,i)=>`<article class="card"><img src="${p.img}" alt="${escapeHtml(p.name)}"><div class="info"><span class="tag">${escapeHtml(p.cat)}</span><h3>${escapeHtml(p.name)}</h3><b>Bei inapatikana dukani</b><div class="actions"><button class="add" onclick="addCart(${i})">🛒 Ongeza</button><button class="share" onclick="shareProduct('${encodeURIComponent(p.name)}')">📤</button></div></div></article>`).join('');
 document.getElementById('resultText').textContent=list.length+' bidhaa';
}
function escapeHtml(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function addCart(i){cart.push(allProducts[i]);document.getElementById('cartCount').textContent=cart.length;alert('Bidhaa imeongezwa kwenye Cart.');}
function openCart(){let el=document.getElementById('cartItems');el.innerHTML=cart.length?cart.map((p,i)=>`<p><b>${i+1}. ${escapeHtml(p.name)}</b> — ${escapeHtml(p.cat)}</p>`).join(''):'<p>Cart iko tupu.</p>';document.getElementById('cartModal').style.display='flex'}
function closeCart(){document.getElementById('cartModal').style.display='none'}
function orderWhatsApp(){if(!cart.length)return alert('Ongeza bidhaa kwanza.');let text='Habari MAPUNDA ELECTRONICS, nataka kuagiza:%0A'+cart.map((p,i)=>(i+1)+'. '+p.name).join('%0A');window.open('https://wa.me/'+WA+'?text='+text,'_blank')}
function openJoin(){document.getElementById('joinModal').style.display='flex'}
function closeJoin(){document.getElementById('joinModal').style.display='none'}

async function joinCommunity(e){
 e.preventDefault();
 const name=document.getElementById('memberName').value.trim();
 const phone=document.getElementById('memberPhone').value.trim();
 const {error}=await db.from('community_members').insert({name,phone});
 if(error){console.error(error);return alert('Haikuweza kujiunga kwa sasa. Hakikisha database imeandaliwa.');}
 localStorage.setItem('mapunda_member_v4',JSON.stringify({name,phone,joined:new Date().toISOString()}));
 closeJoin(); alert('Karibu '+name+'! Umejiunga na MAPUNDA Community.'); renderFeed();
}

async function addPost(e){
 e.preventDefault();
 const title=document.getElementById('postTitle').value.trim();
 const body=document.getElementById('postBody').value.trim();
 const {error}=await db.from('community_posts').insert({title,body});
 if(error){console.error(error);return alert('Post haikuweza kutumwa. Hakikisha database imeandaliwa.');}
 e.target.reset(); renderFeed(); alert('Taarifa imepostwa na itapatikana kwa wateja wote.');
}

async function renderFeed(){
 const posts=await loadPosts();
 const member=JSON.parse(localStorage.getItem('mapunda_member_v4')||'null');
 document.getElementById('feed').innerHTML=(member?`<div class="post"><strong>👋 Karibu, ${escapeHtml(member.name)}</strong><small>Umejiunga na Community</small></div>`:'<div class="post"><strong>Jiunge kwanza</strong><small>Bonyeza “Jiunge na Community” ili uwe mwanachama.</small></div>')+
 (posts.length?posts.map(p=>`<div class="post"><strong>${escapeHtml(p.title)}</strong><div>${escapeHtml(p.body).replace(/\n/g,'<br>')}</div><small>${new Date(p.created_at).toLocaleString('sw-TZ')}</small></div>`).join(''):'<div class="post"><small>Bado hakuna taarifa mpya.</small></div>');
}
async function loadPosts(){
 const {data,error}=await db.from('community_posts').select('id,title,body,created_at').order('created_at',{ascending:false}).limit(50);
 if(error){console.error(error);return [];}
 return data||[];
}

async function addProduct(e){
 e.preventDefault();
 const name=document.getElementById('pname').value.trim();
 const category=document.getElementById('pcat').value;
 const image_url=document.getElementById('pimg').value.trim()||'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=700&q=80';
 const {data,error}=await db.from('products').insert({name,category,image_url}).select().single();
 if(error){console.error(error);return alert('Bidhaa haikuweza kutumwa. Hakikisha database imeandaliwa.');}
 allProducts.unshift({name,cat:category,img:image_url,id:data?.id});
 e.target.reset(); renderProducts(); alert('Bidhaa imeongezwa na itaonekana kwa wateja wote.');
}

async function loadProducts(){
 const {data,error}=await db.from('products').select('id,name,category,image_url').order('created_at',{ascending:false});
 if(error){console.error(error);return;}
 if(data?.length){allProducts=[...data.map(p=>({id:p.id,name:p.name,cat:p.category,img:p.image_url})),...products];}
 renderProducts();
}
function filterCat(cat){renderProducts(allProducts.filter(p=>p.cat===cat));document.getElementById('products').scrollIntoView({behavior:'smooth'})}
function doSearch(){let q=document.getElementById('search').value.toLowerCase();renderProducts(allProducts.filter(p=>(p.name+' '+p.cat).toLowerCase().includes(q)))}
function shareProduct(name){let url=location.href+'#products';if(navigator.share)navigator.share({title:'MAPUNDA ELECTRONICS',text:'Angalia '+decodeURIComponent(name),url});else navigator.clipboard?.writeText(url).then(()=>alert('Link imekopiwa.'))}

document.getElementById('search').addEventListener('input',doSearch);
renderProducts();
renderFeed();
loadProducts();

// Live updates: open customer pages receive new posts/products automatically.
db.channel('mapunda-community-live')
 .on('postgres_changes',{event:'INSERT',schema:'public',table:'community_posts'},()=>renderFeed())
 .on('postgres_changes',{event:'INSERT',schema:'public',table:'products'},()=>loadProducts())
 .subscribe();
