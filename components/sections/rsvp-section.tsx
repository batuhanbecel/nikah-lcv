"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MotionSection, motionItemVariants } from "@/components/motion-section";

type FormState = {
  name: string;
  surname: string;
  phone: string;
  guestCount: string;
  afterParty: boolean;
  note: string;
};

export function RsvpSection() {
  const [form, setForm] = useState<FormState>({ name: "", surname: "", phone: "", guestCount: "2", afterParty: true, note: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (eventSubmit: FormEvent<HTMLFormElement>) => {
    eventSubmit.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, guestCount: Number(form.guestCount) })
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Bir şeyler ters gitti.");
      }

      toast.success("Davet yanıtınız alındı.", {
        description: "Bu güzel günde sizi görmek için sabırsızlanıyoruz."
      });
      setForm({ name: "", surname: "", phone: "", guestCount: "2", afterParty: true, note: "" });
    } catch (error) {
      toast.error("Kaydedilemedi", {
        description: error instanceof Error ? error.message : "Lütfen tekrar deneyin."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionSection id="rsvp" className="overflow-hidden">
      <div className="section-veil" aria-hidden="true" />
      <div className="section-shell grid items-center gap-12 md:grid-cols-[0.9fr_1.1fr]">
        <motion.div variants={motionItemVariants} className="text-center md:text-left">
          <h2 className="font-serif text-5xl leading-tight text-white md:text-7xl">Yanımızda olacağınızı bilmek isteriz.</h2>
          <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-white/64 md:mx-0">
            Davet planlamasını en zarif şekilde tamamlayabilmemiz için katılım bilginizi paylaşabilirsiniz.
          </p>
        </motion.div>

        <motion.form onSubmit={submit} variants={motionItemVariants} className="glass dark-panel rounded-3xl p-5 text-white shadow-[0_30px_110px_rgba(0,0,0,0.42),0_0_56px_rgba(184,140,255,0.1)] md:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Ad</Label>
              <Input
                id="name"
                required
                minLength={2}
                value={form.name}
                onChange={(eventChange) => setForm((current) => ({ ...current, name: eventChange.target.value }))}
                className="mt-2"
                placeholder="Beyza"
              />
            </div>
            <div>
              <Label htmlFor="surname">Soyad</Label>
              <Input
                id="surname"
                required
                minLength={2}
                value={form.surname}
                onChange={(eventChange) => setForm((current) => ({ ...current, surname: eventChange.target.value }))}
                className="mt-2"
                placeholder="Becel"
              />
            </div>
            <div>
              <Label htmlFor="guestCount">Kişi Sayısı</Label>
              <Input
                id="guestCount"
                required
                type="number"
                min={1}
                max={10}
                value={form.guestCount}
                onChange={(eventChange) => setForm((current) => ({ ...current, guestCount: eventChange.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(eventChange) => setForm((current) => ({ ...current, phone: eventChange.target.value }))}
                className="mt-2"
                placeholder="05xx xxx xx xx"
              />
            </div>
            <div className="rounded-2xl border border-white/[0.09] bg-white/[0.06] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_30px_rgba(184,140,255,0.06)] md:col-span-2">
              <Label htmlFor="afterParty" className="block">After Party Katılımı</Label>
              <div className="mt-4 flex min-h-12 w-full items-center justify-between gap-5 rounded-full border border-white/[0.08] bg-white/[0.045] px-5">
                <span className="text-sm text-white/58">{form.afterParty ? "Katılıyorum" : "Katılmıyorum"}</span>
                <Switch
                  id="afterParty"
                  checked={form.afterParty}
                  onCheckedChange={(checked) => setForm((current) => ({ ...current, afterParty: checked }))}
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="note">Not</Label>
              <Input
                id="note"
                value={form.note}
                onChange={(eventChange) => setForm((current) => ({ ...current, note: eventChange.target.value }))}
                className="mt-2"
                placeholder="Varsa iletmek istediğiniz bir not"
              />
            </div>
          </div>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="mt-7">
            <Button type="submit" disabled={loading} className="w-full">
              <Send className="h-4 w-4" />
              {loading ? "Gönderiliyor..." : "Katılımı Gönder"}
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </MotionSection>
  );
}
