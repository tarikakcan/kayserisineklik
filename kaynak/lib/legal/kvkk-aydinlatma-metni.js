import { legalMeta } from './legal-config.js'

export const kvkkAydinlatmaMetni = {
  slug: 'kvkk-aydinlatma-metni',
  title: 'KVKK Aydınlatma Metni',
  subtitle: 'Kişisel Verilerin Korunması Kanunu Kapsamında Bilgilendirme',
  updated: legalMeta.lastUpdated,
  lead: '6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca, kişisel verilerinizin işlenmesine ilişkin aydınlatma metnimizi aşağıda bulabilirsiniz.',
  notice: null,
  sections: [
    {
      num: '01',
      title: 'Giriş',
      paragraphs: [
        `İşbu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun ("KANUN") 10. maddesi uyarınca ${legalMeta.dataController} ("VERİ SORUMLUSU") tarafından, kayserisineklik.com.tr internet sitesi üzerinden toplanan kişisel verilerin işlenmesine ilişkin olarak ilgili kişilerin aydınlatılması amacıyla hazırlanmıştır.`,
        'VERİ SORUMLUSU, kişisel verilerin hukuka uygun şekilde işlenmesine, korunmasına ve güvenliğinin sağlanmasına azami hassasiyet göstermektedir.',
      ],
    },
    {
      num: '02',
      title: 'Veri Toplama ve Kullanım Amacı',
      paragraphs: [
        'Web sitemizde iletişim formu ve ürün sayfalarındaki teklif talebi formu bulunmaktadır. Kullanıcı bu formları doldururken gizlilik politikasını kabul etmiş sayılır.',
        'Formlar doldurulduğunda bilgiler doğrudan şirketimizin info@edekakapi.com e-posta adresine iletilir.',
      ],
      highlights: [
        { label: 'Toplanan Bilgiler', text: 'Ad soyad, telefon numarası, e-posta adresi, müşteri notu, ürün/ölçü/teklif bilgileri' },
        { label: 'Kullanım Amacı', text: 'Bu bilgiler yalnızca müşteriyle iletişime geçmek ve teklif/sipariş sürecini yürütmek amacıyla kullanılır' },
      ],
      listIntro: 'Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:',
      listItems: [
        'Müşteri ile iletişime geçmek',
        'Teklif ve sipariş sürecini yürütmek',
        'Fiyat teklifi taleplerinin değerlendirilmesi ve yanıtlanması',
        'Talep ve şikâyetlerin değerlendirilmesi',
        'Hukuki yükümlülüklerin yerine getirilmesi',
      ],
    },
    {
      num: '03',
      title: 'Veri Saklama Süresi',
      paragraphs: [
        'Kişisel verileriniz, müşteri silmemizi isteyinceye kadar saklanır. Müşteri talep ettiğinde veriler derhal silinir.',
      ],
      important: 'Yasal yükümlülükler (örneğin fatura kayıtları) için mevzuatta öngörülen süreler ayrıca geçerlidir. Vergi Usul Kanunu ve Türk Ticaret Kanunu uyarınca, ticari kayıtlar ve belgeler 10 yıl süreyle saklanmak zorundadır.',
    },
    {
      num: '04',
      title: 'Çerezler (Cookies)',
      paragraphs: [
        'Web sitemizde herhangi bir amaçla çerez toplanmamaktadır. Kullanıcıların kişisel verileri çerezler aracılığıyla işlenmez.',
        'İleride çerez kullanımı söz konusu olursa, kullanıcıya çerez yönetim paneli sunulacak ve tercihlerine göre kişiselleştirme imkânı sağlanacaktır.',
      ],
    },
    {
      num: '05',
      title: 'Yurt Dışına Veri Aktarımı',
      paragraphs: [
        'Kullanıcı formlarından gelen bilgiler, şirketimizin e-posta altyapısı (Hostinger SMTP / info@edekakapi.com) üzerinden işlenmektedir.',
        'E-posta hizmeti sağlayıcısının sunucularının yurt dışında bulunması ihtimali nedeniyle, verilerin yurt dışına aktarımı söz konusu olabilir. Bu durum açıkça belirtilir ve gerekli hallerde kullanıcıdan açık rıza alınır.',
        "KVKK'nın 9. maddesi uyarınca, yurt dışına veri aktarımı için ilgili kişinin açık rızası alınmakta veya KVKK'da öngörülen diğer şartlardan birinin varlığı aranmaktadır.",
      ],
    },
    {
      num: '06',
      title: 'Kişisel Veri Sahibinin Hakları ve Başvuru',
      paragraphs: [
        "KVKK'nın 11. maddesi kapsamında kişisel veri sahipleri olarak aşağıdaki haklara sahipsiniz:",
        'Başvuru Yöntemi: Bu talepler için iletişim formu veya info@edekakapi.com e-posta adresi kullanılabilir.',
      ],
      listItems: [
        'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
        'Verilerinizin silinmesini, düzeltilmesini veya işlenmesinin durdurulmasını talep etme',
        'İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme',
        'Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme',
        'Kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme',
      ],
    },
    {
      num: '07',
      title: 'Başvuru Yöntemi ve İletişim',
      paragraphs: [
        'KVKK kapsamındaki haklarınızı kullanmak için başvurularınızı aşağıdaki yöntemlerle iletebilirsiniz:',
        'Başvurularınız, talebinizin niteliğine göre en geç 30 (otuz) gün içinde ücretsiz olarak sonuçlandırılacaktır. Ancak, işlemin ayrıca bir maliyeti gerektirmesi hâlinde, Kişisel Verileri Koruma Kurulu tarafından belirlenen tarifedeki ücret alınabilir.',
      ],
      contactMethods: true,
    },
    {
      num: '08',
      title: 'Veri Sorumlusunun Kimliği',
      controller: true,
      footnote: 'Bu aydınlatma metni, yasal düzenlemelerdeki değişiklikler doğrultusunda güncellenebilir.',
    },
  ],
}
