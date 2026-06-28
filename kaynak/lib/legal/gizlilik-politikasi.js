import { legalMeta } from './legal-config.js'

export const gizlilikPolitikasi = {
  slug: 'gizlilik-politikasi',
  title: 'Gizlilik Politikası',
  subtitle: 'Kişisel Verilerinizin Korunması ve Gizliliği',
  updated: legalMeta.lastUpdated,
  lead: `${legalMeta.companyLegal} (“Şirket”) olarak, kişisel verilerinizin gizliliğini ve güvenliğini korumayı en önemli önceliklerimizden biri olarak görüyoruz. Bu gizlilik politikası, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verilerinizin nasıl toplandığını, işlendiğini ve korunduğunu açıklamaktadır.`,
  notice: 'Sitemizde yalnızca iletişim formu ve teklif talebi formu bulunmaktadır. Kullanıcı bu formları doldururken gizlilik politikasını kabul etmiş sayılır.',
  sections: [
    {
      num: '01',
      title: 'Giriş',
      paragraphs: [
        `${legalMeta.companyLegal} (“Şirket”), kayserisineklik.com.tr internet sitesi üzerinden elde edilen kişisel verilerin gizliliğini ve güvenliğini korumayı taahhüt eder.`,
        'Bu gizlilik politikası, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında kişisel verilerin işlenmesine ilişkin esasları açıklamaktadır.',
        'Kişisel verilerinizin güvenliği bizim için önceliklidir. Form verileriniz şifreli bağlantılar (HTTPS) üzerinden iletilir.',
      ],
    },
    {
      num: '02',
      title: 'Veri Toplama ve Kullanım Amacı',
      paragraphs: [
        'Sitemizde iletişim formu ve ürün sayfalarındaki teklif talebi formu bulunmaktadır. Formlar doldurulduğunda bilgiler doğrudan şirketimizin info@edekakapi.com e-posta adresine iletilir.',
      ],
      highlights: [
        { label: 'Toplanan Bilgiler', text: 'Ad soyad, telefon numarası, e-posta adresi, müşteri notu, ürün/ölçü/teklif bilgileri' },
        { label: 'Kullanım Amacı', text: 'Bu bilgiler yalnızca müşteriyle iletişime geçmek ve teklif/sipariş sürecini yürütmek amacıyla kullanılır' },
      ],
      purposes: [
        { title: 'Müşteri İletişimi', text: 'Müşteriyle iletişime geçmek' },
        { title: 'Teklif Süreci', text: 'Fiyat teklifi taleplerinin değerlendirilmesi' },
        { title: 'Sipariş Süreci', text: 'Sipariş ve montaj sürecini yürütmek' },
        { title: 'Hukuki Yükümlülükler', text: 'Yasal yükümlülüklerin yerine getirilmesi' },
      ],
    },
    {
      num: '03',
      title: 'Veri Saklama Süresi',
      paragraphs: [
        'Veriler, müşteri silmemizi isteyinceye kadar saklanır. Müşteri talep ettiğinde veriler derhal silinir.',
      ],
      important: 'Yasal yükümlülükler (örneğin fatura kayıtları) için mevzuatta öngörülen süreler ayrıca geçerlidir. Vergi Usul Kanunu ve Türk Ticaret Kanunu uyarınca, ticari kayıtlar ve belgeler 10 yıl süreyle saklanmak zorundadır.',
    },
    {
      num: '04',
      title: 'Yurt Dışına Veri Aktarımı',
      paragraphs: [
        'Kullanıcı formlarından gelen bilgiler, şirketimizin e-posta altyapısı (Hostinger SMTP / info@edekakapi.com) üzerinden işlenmektedir.',
        'E-posta hizmeti sağlayıcısının sunucularının yurt dışında bulunması ihtimali nedeniyle, verilerin yurt dışına aktarımı söz konusu olabilir. Bu durum açıkça belirtilir ve gerekli hallerde kullanıcıdan açık rıza alınır.',
        "KVKK'nın 9. maddesi uyarınca, yurt dışına veri aktarımı için ilgili kişinin açık rızası alınmakta veya KVKK'da öngörülen diğer şartlardan birinin varlığı aranmaktadır.",
      ],
    },
    {
      num: '05',
      title: 'Çerezler (Cookies)',
      paragraphs: [
        'Web sitemizde herhangi bir amaçla çerez toplanmamaktadır. Kullanıcıların kişisel verileri çerezler aracılığıyla işlenmez.',
        'İleride çerez kullanımı söz konusu olursa, kullanıcıya çerez yönetim paneli sunulacak ve tercihlerine göre kişiselleştirme imkânı sağlanacaktır.',
      ],
    },
    {
      num: '06',
      title: 'Haklar ve Başvuru',
      paragraphs: [
        'Kullanıcı, KVKK kapsamında kişisel verilerine ilişkin haklara sahiptir. Taleplerinizi iletişim formu veya info@edekakapi.com e-posta adresi üzerinden iletebilirsiniz.',
      ],
      rights: [
        { title: 'Verilerinin Silinmesini Talep Etme', text: 'Kişisel verilerinizin silinmesini isteme hakkınız vardır.' },
        { title: 'Verilerinin Düzeltilmesini Talep Etme', text: 'Eksik veya yanlış verilerin düzeltilmesini isteme hakkınız vardır.' },
        { title: 'İşlemenin Durdurulmasını Talep Etme', text: 'Kişisel verilerinizin işlenmesinin durdurulmasını isteme hakkınız vardır.' },
      ],
    },
  ],
}
